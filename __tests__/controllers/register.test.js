const {registerController} = require('../../controllers/auth');
const {User} = require("../../models/User");
const bcrypt = require("bcryptjs");
const { mockRequest, mockResponse } = require("jest-mock-req-res");

const response = mockResponse();

jest.mock('../../models/User', () => ({
  User: {
    create: jest.fn(), 
    findOne: jest.fn(), 
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
}));


it("should return status code 400, if there mising name", async () =>{
  const request = {
    body:{
      name:"",
      phone:"0000000000", 
      password:"Password_123",
      role:"driver"
    }
  }
  await registerController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({ message: "Missing required fields: name, phone, password, or role" });
});

it("should return status code 400, if there mising phone", async () =>{
  const request = {
    body:{
      name:"example name",
      phone:"", 
      password:"Password_123",
      role:"driver"
    }
  }
  await registerController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({ message: "Missing required fields: name, phone, password, or role" });
});

it("should return status code 400, if there mising password", async () =>{
  const request = {
    body:{
      name:"example name",
      phone:"0000000000", 
      password:"",
      role:"driver"
    }
  }
  await registerController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({ message: "Missing required fields: name, phone, password, or role" });
})

it("should return status code 400, if there mising role", async () =>{
  const request = {
    body:{
      name:"example name",
      phone:"0000000000", 
      password:"Password_123",
      role:""
    }
  }
  await registerController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({ message: "Missing required fields: name, phone, password, or role" });
})



it("should return status code 400 if the user is exist.", async () =>{

  const request = {
    body:{
      name:"example name",
      phone:"0000000000", 
      password:"Password_123",
      role:"driver"
    }
   
  }

  User.findOne.mockResolvedValue ( () => ({
    name:"example name",
    phone:"0000000000", 
    password:"Password_123",
    role:"driver" 
    }) )
  await registerController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({ message: "User already exists" });
});


it("should return 400 if the length of phone number is less than 9", async () => {
  const request = {
    body:{
      name:"example name",
      phone:"12345678", 
      password:"Password_123",
      role:"driver"
    }
  }
  await registerController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({message:"Invalid phone number"});
});


it("should return 400 if length of phone number is more than 14", async () => {
  const request = {
    body:{
      name:"example name",
      phone:"123456789123456", 
      password:"Password_123",
      role:"driver"
    }
  }
  await registerController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({message:"Invalid phone number"});
});


it("should return 400 if password length is less than 8", async () => {
  const request = {
    body:{
      name:"example name",
      phone:"0000000000", 
      password:"Pass_12",
      role:"driver"
    }
  }
  await registerController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({message:"Password must be at least 8 characters"});
});


it("should return 400 if password does not contain uppercase letter", async () => {
  const request = {
    body:{
      name:"example name",
      phone:"0000000000", 
      password:"password_123",
      role:"driver"
    }
  }
  await registerController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({message:"Password must contain at least one uppercase letter"});
});


it("should return 400 if password does not contain at least one number", async () => {
  const request = {
    body:{
      name:"example name",
      phone:"0000000000", 
      password:"Password_abc",
      role:"driver"
    }
  }
  await registerController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({message:"Password must contain at least one number"});
});


it("should return 400 if password does not contain at least one at least one special character", async () => {
  const request = {
    body:{
      name:"example name",
      phone:"0000000000", 
      password:"Password1234",
      role:"driver"
    }
  }
  await registerController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({message:"Password must contain at least one special character"});
});


it("should return 400 if role is invalid", async () => {
  const request = {
    body:{
      name:"example name",
      phone:"0000000000", 
      password:"Password_1234",
      role:"invalid role"
    }
  }
  await registerController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({message:"Invalid role"});
});


it("should return 400 if length of name is less than 2", async () => {
  const request = {
    body:{
      name:"a",
      phone:"0000000000", 
      password:"Password_1234",
      role:"rider"
    }
  }
  await registerController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({message:"Invalid name"});
});


it("should return 400 if length of name is more than 30", async () => {
  const request = {
    body:{
      name:"example name example name example name",
      phone:"0000000000", 
      password:"Password_1234",
      role:"rider"
    }
  }
  await registerController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({message:"Invalid name"});
});


it("should return 500 if Database error occurs", async () => {

  const req = mockRequest({
    body: {
      name: "example name",
      phone: "0000000000",
      password: "Password_123",
      role: "rider",
    },
  });

  const res = mockResponse();

  User.findOne.mockRejectedValueOnce(new Error("Database error"));
  await registerController(req, res)

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: "Server error",
    error: "Database error",
  });
});



it("should return status code 201 when new user is created", async () =>{

  const request = {
    body:{
      name:"example name",
      phone:"0000000000", 
      password:"Password_123",
      role:"driver"
    }
  }
  User.findOne.mockResolvedValue(null)
  await registerController(request, response)

  expect(response.status).toHaveBeenCalledWith(201);
  expect(response.json).toHaveBeenCalledWith({ message: "User registered successfully" });
});






