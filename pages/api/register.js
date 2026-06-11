"use server"

import dbConnect from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const {name, email, password} = req.body;

        const user = await User.register({
          name: name,
          password: password,
          email: email
        });

        res.status(200).json({ success: !user.hasOwnProperty('error'), data: user });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}