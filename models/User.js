import bcrypt from "bcryptjs"
const lodash = require("lodash");
import UserSchema from "./schemas/UserSchema";

const register = async function(props) {
  const { email, password, name } = props;
    try {
        const userFound = await UserSchema.findOne({ email: email });
        if(userFound){
            return {
                error: 'already_registered'
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = UserSchema.create({
          name: name,
          email: email,
          password: hashedPassword,
        });
        return user;
    } catch(e){
        console.log(e);
    }
}

const update = async function (id, data) {
  return await UserSchema.updateOne({ _id: id }, data);
}

const updatePassword = async function (id, data) {
  if (data.old_password && data.new_password && data.new_password_repeat) {
    const user = await UserSchema.findOne({ _id: id });
    

    if (await bcrypt.compare(data.old_password, user.password) && data.new_password === data.new_password_repeat) {
      const passwordHashed = await bcrypt.hash(data.new_password, 10);
      return await UserSchema.updateOne({ _id: id }, { password: passwordHashed });
    }
  }
  return {};
}

export default {
  register,
  update,
  updatePassword
}