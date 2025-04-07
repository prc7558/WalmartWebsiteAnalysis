import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as fs from 'fs';
import * as path from 'path';

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // API route to fetch data from the data.json file
  app.get('/api/data', async (req, res) => {
    try {
      // Use Node.js path to safely resolve the path
      const dataPath = path.resolve('./attached_assets/data.json');
      
      // Read the file
      const jsonData = fs.readFileSync(dataPath, 'utf8');
      
      // Parse and return the data
      const data = JSON.parse(jsonData);
      res.json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: 'Failed to fetch data', details: errorMessage });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
