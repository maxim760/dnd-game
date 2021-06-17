import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
  
  p,h1,h2,h3,h4,h5,h6 {
    padding: 0;
    margin: 0;
  }
  
  button {
    cursor: pointer;
    background-color: transparent;
    border: none
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    padding: 0;
    margin: 0;
  }
  
  img {
    display: block;
    max-width: 100%;
  }
  
  svg {
    display: block;
  }
  
  input,select,button,textarea {
    font: inherit;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
  table {
    padding: 0;
    margin: 0;
  }
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <>
      <Global />
      <App />
    </>
  </React.StrictMode>,
  document.getElementById("root")
);
