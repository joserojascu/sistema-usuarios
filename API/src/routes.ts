import { UserController } from "./controller/UserController"
import { checkJwt } from "./middlewares/jwt";
export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
    middleware: [checkJwt],
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
},
{
    method: "post", // Método POST para enviar los datos del inicio de sesión
    route: "/login", // Ruta para el inicio de sesión
    controller: UserController,
    action: "login" // Acción para manejar la autenticación
  },
  {
    method: "post", // Método POST para enviar los datos del inicio de sesión
    route: "/change-password", // Ruta para el inicio de sesión
    controller: UserController,
    middleware: [checkJwt],
    action: "changePassword" // Acción para manejar la autenticación
  }

]