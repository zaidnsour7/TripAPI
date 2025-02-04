const{createTripController} = require("../../controllers/trip");
const {User} = require("../../models/User");
const {Trip} = require("../../models/Trip");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {getUserIdFromJWT} = require("../../helper");
const {  mockResponse } = require("jest-mock-req-res");

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


jest.mock('../../models/Trip', () => ({
  Trip: {
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


it("should return status code 400, if there mising Pickup Location", async () =>{
  const request = {
    body:{

      "dropoffLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      }
    }
  }
  await createTripController(request, response)
  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({ message: "Pickup location or drop-off location is missing." });
});


it("should return status code 400, if there mising Dropoff Location", async () =>{
  const request = {
    body:{
      "pickupLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      }
    }
  }
  await createTripController(request, response)
  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({ message: "Pickup location or drop-off location is missing." });
});


it("should return status code 400, if the Pickup Location is invalid", async () =>{
  const request = {
    body:{

      "pickupLocation":{
        "lat":91,
        "lng":35.844088519269484
      },

      "dropoffLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      }
    }
  }
  await createTripController(request, response)
  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({ message: "Invalid coordinates provided." });
});


it("should return status code 400, if the Dropoff Location is invalid", async () =>{
  const request = {
    body:{

      "pickupLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      },

      "dropoffLocation":{
        "lat":32.0221565233734,
        "lng":181
      }
    }
  }
  await createTripController(request, response)
  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({ message: "Invalid coordinates provided." });
});


it("should return status code 404, if the Rider is not found", async () =>{

  const mockToken = "mocked_jwt_token";
  const mockRiderId = 123;

  const request = {
    body:{

      "pickupLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      },

      "dropoffLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      }
    },
    headers: {
      authorization: `Bearer ${mockToken}`
    }
  }

  jwt.verify.mockReturnValue({ id: mockRiderId });
  getUserIdFromJWT.mockResolvedValue(mockRiderId);
  jest.spyOn(User, "findOne").mockResolvedValue(null);
 

  await createTripController(request, response)

  expect(getUserIdFromJWT).toHaveBeenCalledWith(mockToken);
  expect(User.findOne).toHaveBeenCalledWith({ where: { id:mockRiderId} });
  expect(response.status).toHaveBeenCalledWith(404);
  expect(response.json).toHaveBeenCalledWith({ message: "Rider not found." });
});


it("should return 403 if Access denied due to insufficient permissions", async () => {
  const mockToken = "mocked_jwt_token";
  const mockUserId = 123;

  const request = {
    body:{

      "pickupLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      },

      "dropoffLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      }
    },
    headers: {
      authorization: `Bearer ${mockToken}`
    }
  }

  const response = mockResponse();

  jwt.verify.mockReturnValue({ id: mockUserId });
  getUserIdFromJWT.mockResolvedValue(mockUserId);


  const rider = {
    role:"driver",
    save: jest.fn().mockResolvedValue(),
  };
  jest.spyOn(User, "findOne").mockResolvedValue(rider);
 
  await createTripController(request, response);

  expect(response.status).toHaveBeenCalledWith(403);
  expect(response.json).toHaveBeenCalledWith({
    message: "Access denied, Insufficient permissions.",
  });
});


it("should return 400 if the Rider already part of an active trip.", async () => {
  const mockToken = "mocked_jwt_token";
  const mockRiderId = 123;

  const request = {
    body:{

      "pickupLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      },

      "dropoffLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      }
    },
    headers: {
      authorization: `Bearer ${mockToken}`
    }
  }

  const response = mockResponse();

  jwt.verify.mockReturnValue({ id: mockRiderId });
  getUserIdFromJWT.mockResolvedValue(mockRiderId);


  const rider = {
    role:"rider",
    save: jest.fn().mockResolvedValue(),
  };
  jest.spyOn(User, "findOne").mockResolvedValue(rider);

  const trip = {
    riderId: mockRiderId,
    state: "created",
  };

  jest.spyOn(Trip, "findOne").mockResolvedValue(trip);

 
  await createTripController(request, response);

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.json).toHaveBeenCalledWith({
    message: "Rider already part of an active trip.",
  });
});



it("should return 500 if Database error occurs while saving the driver state", async () => {
  const mockToken = "mocked_jwt_token";
  const mockRiderId = 123;

  const request = {
    body:{

      "pickupLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      },

      "dropoffLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      }
    },
    headers: {
      authorization: `Bearer ${mockToken}`
    }
  }

  const response = mockResponse();

  jwt.verify.mockReturnValue({ id: mockRiderId });
  getUserIdFromJWT.mockResolvedValue(mockRiderId);


  jest.spyOn(User, "findOne").mockImplementation(async ({ where }) => {
    if (where.id === mockRiderId) {
      return { id: mockRiderId, role: "rider" }; 
    }
    if (where.role === "driver" && where.driverState === "online") {
      return { 
        role: "driver", 
        driverState: "online", 
        save: jest.fn().mockRejectedValue(new Error("Database error")) 
      };
    }
    return null;
  });
  
  jest.spyOn(Trip, "findOne").mockResolvedValue(null);

  await createTripController(request, response);

  expect(response.status).toHaveBeenCalledWith(500);
  expect(response.json).toHaveBeenCalledWith({
    message: "Server error",
    error: "Database error",
  });
});





it("should return 500 if Database error occurs while creating the trip", async () => {
  const mockToken = "mocked_jwt_token";
  const mockRiderId = 123;

  const request = {
    body:{

      "pickupLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      },

      "dropoffLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      }
    },
    headers: {
      authorization: `Bearer ${mockToken}`
    }
  }

  const response = mockResponse();

  jwt.verify.mockReturnValue({ id: mockRiderId });
  getUserIdFromJWT.mockResolvedValue(mockRiderId);


  jest.spyOn(User, "findOne").mockImplementation(async ({ where }) => {
    if (where.id === mockRiderId) {
      return { id: mockRiderId, role: "rider" }; 
    }
    if (where.role === "driver" && where.driverState === "online") {
      return { 
        role: "driver", 
        driverState: "online", 
        save: jest.fn().mockResolvedValue()
      };
    }
    return null;
  });
  

  jest.spyOn(Trip, "findOne").mockResolvedValue(null);
  jest.spyOn(Trip, "create").mockRejectedValue(new Error("Database error"));
 
  await createTripController(request, response);

  expect(response.status).toHaveBeenCalledWith(500);
  expect(response.json).toHaveBeenCalledWith({
    message: "Server error",
    error: "Database error",
  });
});

it("should return 201 if Trip created Succesfully", async () => {
  const mockToken = "mocked_jwt_token";
  const mockRiderId = 123;

  const request = {
    body:{

      "pickupLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      },

      "dropoffLocation":{
        "lat":32.0221565233734,
        "lng":35.844088519269484
      }
    },
    headers: {
      authorization: `Bearer ${mockToken}`
    }
  }

  const response = mockResponse();

  jwt.verify.mockReturnValue({ id: mockRiderId });
  getUserIdFromJWT.mockResolvedValue(mockRiderId);


  jest.spyOn(User, "findOne").mockImplementation(async ({ where }) => {
    if (where.id === mockRiderId) {
      return { id: mockRiderId, role: "rider" }; 
    }
    if (where.role === "driver" && where.driverState === "online") {
      return { 
        role: "driver", 
        driverState: "online", 
        save: jest.fn().mockResolvedValue()
      };
    }
    return null;
  });
  

  jest.spyOn(Trip, "findOne").mockResolvedValue(null);



  
  jest.spyOn(Trip, "create").mockResolvedValue();
 
  await createTripController(request, response);

  expect(response.status).toHaveBeenCalledWith(201);
  expect(response.json).toHaveBeenCalledWith({ message: "Trip created Succesfully." })
});