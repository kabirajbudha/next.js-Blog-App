import { ConnectDB } from "@/lib/config/db"
import BlogModel from "@/lib/models/BlogModel";
const { NextResponse } = require("next/server")
import { writeFile } from "fs/promises"
const fs = require("fs")

const LoadDB = async () => {
    await ConnectDB();
}

LoadDB();



//api endpoing to get all blogs
export async function GET(request) {
    const blogId = request.nextUrl.searchParams.get("id");
    if (blogId) {
        const blog = await BlogModel.findById(blogId);
        return NextResponse.json(blog);
    }
    else {
        const blogs = await BlogModel.find({});
        return NextResponse.json({ blogs });
    }


}

//api endpoint for uploading blogs
export async function POST(request) {
    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get("image")
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const path = `./public/uploads/${timestamp}_${image.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
    await writeFile(path, buffer)
    const imgUrl = `/uploads/${timestamp}_${image.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;


    const blogData = {
        title: `${formData.get("title")}`,
        description: `${formData.get("description")}`,
        category: `${formData.get("category")}`,
        author: `${formData.get("author")}`,
        image: `${imgUrl}`,
        authorImg: `${formData.get("authorImg")}`
    }

    try {
        await BlogModel.create(blogData);
        return NextResponse.json({ success: true, msg: "blog added" });
    } catch (err) {
        return NextResponse.json({ success: false, msg: "Failed to add blog" });
    }

    return NextResponse.json({ success: true, msg: "blogadded" });
}

//creating api endpoint to delete blog

export async function DELETE(request) {
    const id = await request.nextUrl.searchParams.get("id");
    const blog = await BlogModel.findById(id);
    fs.unlink(`./public${blog.image}`,()=>{})
    await BlogModel.findByIdAndDelete(id);
    return NextResponse.json({msg:"Blog Deleted"})
}
