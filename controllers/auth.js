const bcrypt = require("bcrypt");
const Users = require("../models/users");
const error = (err) => {
  console.log(chalk.red(err));
};
const { createToken, createFileUrl, resizeImg } = require("../utils/index");

exports.signIn = async (req, res) => {
  try {
    const { email, role, password } = req.body;
    if (isCredentialsValid(req.body) !== true) {
      return res.status(400).json(isCredentialsValid);
    }
    const user = await Users.findOne({ email });
    if (user) {
      const { password: hash, _id, name, isAdmin } = user;
      const isPasswordCorrect = await bcrypt.compare(password, hash);
      const token = createToken({ _id: user._id, role: user.role ?? "user" });
      if (isPasswordCorrect) {
        res.json({ payload: user, token, success: true });
      } else {
        res.json({ msg: "Username or password is wrong", success: false });
      }
    } else {
      res.json({
        msg: `No user exist with user name ${email}`,
        success: false,
      });
    }
  } catch (err) {
    res.json({ msg: err.message, success: false });
  }
};

exports.signUp = async (req, res) => {
  const { password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    if (!email) return res.status(400).json({ msg: 'email required' });
    if (!req.body.password) return res.status(400).json({ msg: 'password required' });
    const user = await Users.create({ ...req.body });
    const token = createToken({ _id: user?._id, role: user?.role ?? "user" });
    res.json({ user: user, token, success: true });
  } catch (err) {
    const msg =
      err.code === 11000
        ? `Users with "${email}" email adress is exist`
        : err.message;
    res.json({ success: false, msg });
  }
};

exports.getProfile = async (req, res) => {
  const { role, _id } = req.locals;
  try {
    const user = await models[util.getModelName(role)].findById(_id);
    res.json({ success: true, payload: user });
  } catch (err) {
    error(err);
  }
};


function isCredentialsValid(body) {
  const { password, login, phone } = body;
  if (!password && (!login)) return ({ msg: 'login and password required' });
  if (!password) return ({ msg: 'password required' });
  if (!login) return ({ msg: 'email or phone is required' });
  return true;
};