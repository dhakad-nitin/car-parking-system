import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  @Get()
  getWelcomePage(@Res() res: Response) {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Car Parking System API</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              line-height: 1.6;
            }
            .container {
              text-align: center;
              margin-top: 50px;
            }
            h1 {
              color: #2c3e50;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #3498db;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .button:hover {
              background-color: #2980b9;
            }
            .features {
              text-align: left;
              margin-top: 30px;
            }
            .features ul {
              list-style-type: none;
              padding: 0;
            }
            .features li {
              margin: 10px 0;
              padding: 10px;
              background-color: #f8f9fa;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to Car Parking System API</h1>
            <p>A robust API for managing car parking lots with features like parking, unparking, and querying car information.</p>
            <a href="/api-docs" class="button">View API Documentation</a>
            
            <div class="features">
              <h2>Key Features:</h2>
              <ul>
                <li>Create and manage multiple parking lots</li>
                <li>Park and unpark cars with registration tracking</li>
                <li>Query cars by color and registration number</li>
                <li>Expand parking lot capacity as needed</li>
                <li>Real-time parking lot status monitoring</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `);
  }
} 