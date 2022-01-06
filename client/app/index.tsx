import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import Header from "./components/Header/Header";
import Home from "./components/pages/Home/Home";
import ChatPage from "./components/pages/Chat/ChatPage";

import "./styles/styles.scss";
import "bootstrap/dist/css/bootstrap.rtl.min.css";

import { getStore } from "./store";
import Admin from "./components/pages/Admin/Admin";
import Container from "react-bootstrap/Container";
import Login from "./components/pages/Login/Login";

render(
  <BrowserRouter>
    <Provider store={getStore()}>
      <Header />
      <main className="mt-4">
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/chat/:partyId" element={<ChatPage />} />
            <Route element={<h4>הדף לא נמצא 404 :P</h4>} />
          </Routes>
        </Container>
      </main>
    </Provider>
  </BrowserRouter>,

  document.getElementById("app")
);
