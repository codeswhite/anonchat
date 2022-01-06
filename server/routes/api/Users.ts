import { Request, Response, NextFunction, Router } from "express";
import { HydratedDocument } from "mongoose";
import { IUser, UserModel } from "../../models/User";

import { createHmac, BinaryLike } from "crypto";

const doSha256 = (data: BinaryLike) => {
  return createHmac("sha256", "S41t").update(data).digest("hex");
};

const router = Router();

router.get("/public", (req: Request, res: Response, next: NextFunction) => {
  UserModel.find({ publicName: { $exists: true } }, "_id pid publicName")
    .exec()
    .then((users) => res.json(users))
    .catch((err: Error) => next(err));
});

router.get("/all", (req: Request, res: Response, next: NextFunction) => {
  UserModel.find({})
    .exec()
    .then((users) => res.json(users))
    .catch((err: Error) => next(err));
});

router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  UserModel.findById(req.params.id, "pid hash publicName")
    .exec()
    .then((users) => res.json(users))
    .catch((err: Error) => next(err));
});

router.get(
  "/:pid/aquire",
  (req: Request, res: Response, next: NextFunction) => {
    // Try to return user data
    const _pid = parseInt(req.params.pid);
    UserModel.findOne({ pid: _pid })
      .populate("chats")
      .exec()
      .then((user) => {
        if (user) {
          return res.json(user);
        }
        // if no such user found then we create a new user
        const new_user: HydratedDocument<IUser> = new UserModel({
          pid: _pid,
          hash: doSha256(_pid.toString()),
        });
        new_user
          .save()
          .then(() => res.json(new_user))
          .catch((err: Error) => next(err));
      })
      .catch((err: Error) => next(err));
  }
);

router.put(
  "/:id/setAdmin",
  (req: Request, res: Response, next: NextFunction) => {
    const { isAdmin } = req.body;
    UserModel.findByIdAndUpdate(req.params.id, { isAdmin }, { new: true })
      .exec()
      .then((user) => res.json(user))
      .catch((err) => next(err));
  }
);

router.put(
  "/:id/updatePublicName",
  (req: Request, res: Response, next: NextFunction) => {
    const { publicName } = req.body;
    UserModel.findByIdAndUpdate(req.params.id, { publicName }, { new: true })
      .exec()
      .then((user) => res.json(user))
      .catch((err) => next(err));
  }
);

router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  UserModel.findByIdAndDelete(req.params.id)
    .exec()
    .then((user) => res.json(user))
    .catch((err) => next(err));
});

export default router;
