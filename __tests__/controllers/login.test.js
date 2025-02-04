const {loginController} = require('../../controllers/auth');
const {User} = require("../../models/User");
const bcrypt = require("bcryptjs");
const { mockRequest, mockResponse } = require("jest-mock-req-res");
const jwt = require("jsonwebtoken")

const response = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};


jest.mock('../../models/User', () => ({
  User: {
    create: jest.fn(), 
    findOne: jest.fn(), 
  },
}));


jest.mock("bcryptjs", () => ({
  compare: jest.fn()
}));


jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));



it("should return status code 400, if there mising phone", async () =>{
  const request = {
    body:{
      phone:"", 
      password:"Password_123",
    }
  }
  await loginController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({ message: "Missing required fields: phone, or password" });
});

it("should return status code 400, if there mising password", async () =>{
  const request = {
    body:{
      phone:"0000000000", 
      password:"",
    }
  }
  await loginController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({ message: "Missing required fields: phone, or password" });
});


it("should return status code 404 if the user is not found.", async () =>{

  const request = {
    body:{
      phone:"0000000000", 
      password:"Password_123", 
    }
  }
  User.findOne.mockResolvedValue(null)
  await loginController(request, response)

  expect(response.status).toHaveBeenCalledWith(404);
  expect(response.json).toHaveBeenCalledWith({ message: "User not found" });
});


it("should return 400 if the password is invalid", async () => {
  const request = {
    body:{
      phone:"0000000000", 
      password:"Password_125",
    }
  }
  User.findOne.mockResolvedValue ( () => ({
    name:"example name",
    phone:"0000000000", 
    password:"Password_123",
    role:"driver" 
    }) )

    //bcrypt.compare.mockResolvedValue(false);

  await loginController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({message:"Invalid number or, password"});
});


it("should return 400 if the number is invalid", async () => {
  const request = {
    body:{
      phone:"0000000001", 
      password:"Password_123",
    }
  }
  User.findOne.mockResolvedValue ( () => ({
    name:"example name",
    phone:"0000000000", 
    password:"Password_123",
    role:"driver" 
    }) )
  bcrypt.compare.mockResolvedValue(true);

  await loginController(request, response)

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({message:"Invalid number or, password"});
});



it("should return 500 if Database error occurs", async () => {

  const req = mockRequest({
    body: {
      phone:"0000000000", 
      password:"Password_123",
    },
  });

  const res = mockResponse();

  User.findOne.mockRejectedValueOnce(new Error("Database error"));
  await loginController(req, res)

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: "Server error",
    error: "Database error",
  });
});


it("should return 200 if User login succesfully", async () =>{

  const request = {
    body:{
      phone:"0000000000", 
      password:"Password_123",
    }
  }

  User.findOne.mockResolvedValue ({
    name:"example name",
    phone:"0000000000", 
    password:"Password_123",
    role:"driver" 
    });

  bcrypt.compare.mockResolvedValue(true);  
  jest.spyOn(jwt, "sign").mockReturnValue("mocked_token");
  await loginController(request, response)

  expect(response.status).toHaveBeenCalledWith(200);
  expect(response.json).toHaveBeenCalledWith({ token: "mocked_token" })


  jwt.sign.mockRestore();
});



