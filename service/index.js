import { User } from "./schemas/users.js";
import { Contact } from "./schemas/contacts.js";
import "dotenv/config";
import nodemailer from "nodemailer";

// users services
export const createUser = async (body) => {
  const { email, password } = body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("Acest email este deja inregistrat");
    }
    const newUser = new User(body);
    newUser.setPassword(password);

    return await newUser.save();
  } catch (err) {
    err.status = 409;
    throw err;
  }
};

export const loginUser = async ({ email, password }, token) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      { token: token }
    );
    if (!user || !user.validatePassword(password)) {
      throw new Error("Credentialele de autentificare nu sunt valide");
    }
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      subscription: user.subscription,
    };
  } catch (err) {
    throw err;
  }
};

export const findCurrentUser = async (token) => {
  const user = await User.findOne({ token });
  try {
    if (!user) {
      throw new Error(
        "There was an error retrieving the user please try later"
      );
    }
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarUrl,
      verifiedUser: user.verifiedUser,
    };
  } catch (err) {
    err.status = 404;
    throw err;
  }
};

export const validateUserEmail = async (email) => {
  try {
    const user = await User.findOne({
      email,
    });
    user.verifiedUser = true;
    await user.save();  
    return user;
  } catch (err) {
    throw err;
  }
};

export const logOutUser = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, { token: null });
  } catch (err) {
    err.status = 404;
    err.message = "No user with this id was found";
    throw err;
  }
};

// contacts services
export const getAllContacts = async () => {
  try {
    const data = await Contact.find({});
    return data;
  } catch (err) {
    throw err;
  }
};

export const getContactById = async (contactId) => {
  try {
    const data = await Contact.findById(contactId);
    return data;
  } catch (err) {
    throw err;
  }
};

export const removeContact = async (contactId) => {
  try {
    await Contact.deleteOne({ _id: contactId });
  } catch (err) {
    throw err;
  }
};

export const addContact = async (body) => {
  try {
    await Contact.create({
      ...body,
    });
  } catch (err) {
    throw err;
  }
};

export const updateContact = async (contactId, body) => {
  try {
    await Contact.findByIdAndUpdate(contactId, body);
  } catch (err) {
    throw err;
  }
};

export const updateStatusContact = async (contactId, favorite) => {
  try {
    const foundContact = await getContactById(contactId);
    if (foundContact) {
      if (foundContact.favorite !== favorite.favorite) {
        await Contact.findByIdAndUpdate(contactId, favorite);
      } else {
        throw new Error(`Contact already ${favorite.favorite}`);
      }
    } else {
      throw new Error("Contact not found");
    }
  } catch (err) {
    throw err;
  }
};

// Joi validation
export const validateBody = async (data, schema) => {
  try {
    return await schema.validateAsync(data, { abortEarly: false });
  } catch (err) {
    const validationError = new Error(
      JSON.stringify({
        status: 400,
        errors: err.details.map((err) => ({
          field: err.context.key,
          message: err.message,
        })),
      })
    );
    validationError.status = 400;
    throw validationError;
  }
};

// nodemailer services

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendMail = async (email, token) => {
  try {
    await transporter.sendMail({
      to: email,
      subject: "Hello feom node",
      html: `<h1 style='font-family:sans-serif;'>To verify your email please click <a style='color:red; font-weight:bold;' href="http://localhost:5000/api/users/verify-email/${token}">here</a></h1>`,
    });
    console.log("[server] Email sent");
  } catch (err) {
    console.error(err);
  }
};

