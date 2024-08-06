import { AppDataSource } from 'ormconfig';
import { UserModel } from 'src/entity/user.entity';
import { RolesEnum } from 'src/types/user.type';
import * as dotenv from 'dotenv';

dotenv.config();

export const createInitialAdmin = async () => {
  const userRepo = AppDataSource.getRepository(UserModel);
  const { ADMIN_NAME, ADMIN_EMAIL } = process.env;

  const existingAdmin = await userRepo.findOne({ where: { role: RolesEnum.ADMIN } });
  if (!existingAdmin) {
    const admin = userRepo.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: RolesEnum.ADMIN,
    });
    await userRepo.save(admin);
  }
};
