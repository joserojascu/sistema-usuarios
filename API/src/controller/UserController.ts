import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { checkJwt } from "../middlewares/jwt";
import { checkRole } from "../middlewares/role";
import { validate } from 'class-validator';

import * as jwt from 'jsonwebtoken';
import config from "../config/config";
import { getRepository } from "typeorm";



export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    try {
      
      checkJwt(request, response, async () => {
      const users = await this.userRepository.find();

      if (users.length > 0) {
        response.json(users);
      } else {
        response.json({ message: "No hay resultados" });
      }
    });
    
    } catch (error) {
      next(error);
    }
  }

  async one(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id);
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        response.status(404).json({ message: "Usuario no registrado" });
      } else {
        response.json(user);
      }
    } catch (error) {
      next(error);
    }
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const { id, firstName, lastName, password, phone, gender, age, rol } =
        request.body;
      const user = Object.assign(new User(), {
        id,
        firstName,
        lastName,
        password,
        phone,
        gender,
        age,
        rol,
      });
      user.hashPassword();
      const savedUser = await this.userRepository.save(user);
      response.status(201).json(savedUser);
    } catch (error) {
      next(error);
    }
  }
  
  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const { firstName, lastName, age, phone, gender, rol, password } = req.body;

      const userToUpdate = await this.userRepository.findOne({ where: { id } });

      if (!userToUpdate) {
        res.status(404).json({ message: "Usuario no está registrado" });
      }

      userToUpdate.firstName = firstName || userToUpdate.firstName;
      userToUpdate.lastName = lastName || userToUpdate.lastName;
      userToUpdate.age = age || userToUpdate.age;
      userToUpdate.phone = phone || userToUpdate.phone;
      userToUpdate.gender = gender || userToUpdate.gender;
      userToUpdate.rol = rol || userToUpdate.rol;
      userToUpdate.password = password || userToUpdate.password;

      await this.userRepository.save(userToUpdate);

      res.json({ message: "Usuario ha sido actualizado correctamente" });
    } catch (error) {
      next(error);
    }
  }


  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id);
      const userToRemove = await this.userRepository.findOne({ where: { id } });

      if (!userToRemove) {
        response.status(404).json({ message: "usuario no está registrado" });
      } else {
        await this.userRepository.remove(userToRemove);
        response.json({ message: "Usuario ha sido eliminado" });
      }
    } catch (error) {
      next(error);
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const { firstName, password } = request.body;
      const user = await this.userRepository.findOne({ where: { firstName } });
       
      if (user == null) {
        response.status(401).json({ message: "Usuario no encontrado" });
      } 
      else {
        const isPasswordValid = await user.checkPassword(password);

        if (isPasswordValid) {
          const userId = user.id;
          const rol = user.rol;
          const token = jwt.sign({userId: user.id, username:user.firstName}, config.jwtSecret,{expiresIn:'1h'});
          response
            .status(200)
            .json({ message: "Inicio de sesión exitoso", token, userId,rol  });

           
        } else {
          response.status(401).json({ message: "Contraseña incorrecta" });
        }
      }
    } catch (error) {
      response.status(401).json({ message: error });
      next(error);
    }
  }

  async changePassword(request: Request, response: Response, next: NextFunction) {
    try {
      // checkJwt(request, response, async () => {
        const { userId } = response.locals.jwtPayload;
        const { oldPassword, newPassword } = request.body;
  
        if (!(oldPassword && newPassword)) {
          return response.status(400).json({ message: 'Se requiere la contraseña anterior y la nueva contraseña' });
        }
  
        const user = await this.userRepository.findOneOrFail({ where: { id: userId } });
  
        if (!(await user.checkPassword(oldPassword))) {
          return response.status(401).json({ message: 'Verifica tu contraseña anterior' });
        }
  
        if (oldPassword === newPassword) {
          return response.status(400).json({ message: 'La nueva contraseña debe ser diferente a la anterior' });
        }
  
        user.password = newPassword;
        user.hashPassword();
  
        const validationOps = { validationError: { target: false, value: false } };
        const errors = await validate(user, validationOps);
  
        if (errors.length > 0) {
          return response.status(400).json(errors);
        }
  
        await this.userRepository.save(user);
  
        return response.json({ message: '¡Contraseña cambiada correctamente!' });
      // });
    } catch (error) {
      response.status(500).json({ message: 'Algo salió mal al cambiar la contraseña' , error});
    }
  }
}
