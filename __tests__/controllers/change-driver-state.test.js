const{changeDriverStateController} = require("../../controllers/driver");
const {User} = require("../../models/User");
const bcrypt = require("bcryptjs");
const { mockResponse } = require("jest-mock-req-res");
const jwt = require("jsonwebtoken");
const {getUserIdFromJWT} = require("../../helper");

const response = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};


jest.mock('../../helper', () => ({
  getUserIdFromJWT: jest.fn()
}));

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
  verify: jest.fn(),
}));



it("should return status code 400, if there mising state", async () =>{
  const request = {
    body:{
      state:"", 
    }
  }
  await changeDriverStateController(request, response)
  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({ message: "Missing driver state." });
});


it("should return status code 400, if the state is invalid", async () =>{
  const request = {
    body:{
      state:"Invalid", 
    }
  }
  await changeDriverStateController(request, response)
  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({ message: "Invalid driver State." });
});


it("should return status code 404, if the Driver is not found", async () =>{

  const mockToken = "mocked_jwt_token";
  const mockDriverId = 123;

  const request = {
    body:{
      state:"online", 
    },
    headers: {
      authorization: `Bearer ${mockToken}`
    }
  };

  jwt.verify.mockReturnValue({ id: mockDriverId });
  getUserIdFromJWT.mockResolvedValue(mockDriverId);
  User.findOne.mockResolvedValue(null);

  //console.log('Request headers:', request.headers);
  //console.log('Token extracted:', request.headers.authorization?.split(' ')[1]);
  
  await changeDriverStateController(request, response)

  expect(getUserIdFromJWT).toHaveBeenCalledWith(mockToken);
  expect(User.findOne).toHaveBeenCalledWith({ where: { id: mockDriverId } });
  expect(response.status).toHaveBeenCalledWith(404);
  expect(response.json).toHaveBeenCalledWith({ message: "Driver not found." });
});



it("should return 500 if Database error occurs while saving the driver state", async () => {

  const mockToken = "mocked_jwt_token";
  const mockDriverId = 123;

  const request = {
    body:{
      state:"online", 
    },
    headers: {
      authorization: `Bearer ${mockToken}`
    }
  };

  const response = mockResponse();

  jwt.verify.mockReturnValue({ id: mockDriverId });
  getUserIdFromJWT.mockResolvedValue(mockDriverId);

  const driver = {
    role:"driver" ,
    save: jest.fn().mockRejectedValue(new Error("Database error")),  
  };

  jest.spyOn(User, "findOne").mockResolvedValue(driver);
  await changeDriverStateController(request, response)

  expect(response.status).toHaveBeenCalledWith(500);
  expect(response.json).toHaveBeenCalledWith({
    message: "Server error",
    error: "Database error",
  });
});


it("should return 403 if Access denied due to insufficient permissions", async () => {
  const mockToken = "mocked_jwt_token";
  const mockUserId = 123;

  const request = {
    body: { state: "online" },
    headers: { authorization: `Bearer ${mockToken}` },
  };

  const response = mockResponse();

  jwt.verify.mockReturnValue({ id: mockUserId });
  getUserIdFromJWT.mockResolvedValue(mockUserId);


  const driver = {
    role:"rider",
    save: jest.fn().mockResolvedValue(),
  };
  jest.spyOn(User, "findOne").mockResolvedValue(driver);
 
  await changeDriverStateController(request, response);

  expect(response.status).toHaveBeenCalledWith(403);
  expect(response.json).toHaveBeenCalledWith({
    message: "Access denied, Insufficient permissions.",
  });
});


it("should return 200 if Driver state updated successfully", async () =>{

  const mockToken = "mocked_jwt_token";
  const mockDriverId = 123;

  const request = {
    body:{
      state:"online", 
    },
    headers: {
      authorization: `Bearer ${mockToken}`
    }
  };

  jwt.verify.mockReturnValue({ id: mockDriverId });
  getUserIdFromJWT.mockResolvedValue(mockDriverId);

  const driver = {
    role:"driver",
    save: jest.fn().mockResolvedValue(),
  };
  jest.spyOn(User, "findOne").mockResolvedValue(driver);


  await changeDriverStateController(request, response)

  expect(response.status).toHaveBeenCalledWith(200);
  expect(response.json).toHaveBeenCalledWith({ message: "Driver state updated successfully." })
});

