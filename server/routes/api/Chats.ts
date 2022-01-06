import { Request, Response, NextFunction, Router } from "express";
import { IChat, ChatModel } from "../../models/Chat";
import { HydratedDocument } from "mongoose";
import { UserModel } from "../../models/User";

const router = Router();

router.get(
  "/:id",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const chat = await ChatModel.findById(req.params.id).exec();
      res.json(chat);
    } catch (err) {
      res.status(500).json({ err });
      next(err);
    }
  }
);

router.post(
  "/",
  async function (req: Request, res: Response, next: NextFunction) {
    const message = {
      from: req.body.from,
      title: req.body.title,
      text: req.body.text,
    };
    const { privateId, publicId } = req.body;

    // Chat if chat exists
    try {
      lookupAndInsert: {
        // Block indentation
        const chat = await ChatModel.findOneAndUpdate(
          {
            $and: [{ "private.id": privateId }, { "public.id": publicId }],
          },
          { $push: { messages: message } },
          { new: true }
        ).exec();

        if (chat) {
          res.json(chat);
          return next();
        }
      }

      const publicUser = await UserModel.findById(publicId).exec();
      const privateUser = await UserModel.findById(privateId).exec();

      const chat: HydratedDocument<IChat> = new ChatModel({
        public: {
          id: publicUser!._id,
          name: publicUser!.publicName,
        },
        private: {
          id: privateUser!._id,
          name: privateUser!.hash,
        },
        messages: [message],
      });

      await chat.save();

      // Update references for chat participants
      await UserModel.findByIdAndUpdate(publicId, {
        $push: { chats: chat._id },
      }).exec();

      await UserModel.findByIdAndUpdate(privateId, {
        $push: { chats: chat._id },
      }).exec();

      res.json(chat); // Return the created chat instance
    } catch (err) {
      res.status(500).json({ err });
      console.error(err);
      next(err);
    }
  }
);

export default router;
