import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".", // client folder root
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./index.html"),
        login: resolve(__dirname, "./login-page/login.html"),
        home: resolve(__dirname, "./home/home.html"),
        newIssue: resolve(__dirname, "./new-issue/new-issue.html"),
        issue: resolve(__dirname, "./issue-page/issue.html"),
      },
    },
  },
});
