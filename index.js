// Load environment variables from a .env file
require('dotenv').config();
const { Dropbox } = require('dropbox'); // Import the Dropbox SDK
const fetch = require('isomorphic-fetch'); // Import a fetch-compatible library for making HTTP requests
const fs = require('fs'); // Import Node.js's native file system module for reading and writing files

// Initialize a new Dropbox client with the access token from environment variables
const dbx = new Dropbox({
    accessToken: process.env.ACCESS_TOKEN,
    fetch
});

// Define an asynchronous function to list all files in a given Dropbox path
async function getAllFiles(path) {
    try {
        // Request a list of files from Dropbox
        const files = await dbx.filesListFolder({ path });
        // Return the list of file entries
        return files.result.entries;
    } catch (error) {
        // Log any errors that occur
        console.error('Error listing files:', error);
        throw error; // Rethrow the error to propagate it further
    }
}

// Define an asynchronous function to upload a file to Dropbox
async function uploadFile(localFilePath, dropboxPath) {
    try {
        // Read the content of the file from the local file system
        const fileContent = fs.readFileSync(localFilePath);
        // Upload the file content to Dropbox at the specified path
        const fileUploaded = await dbx.filesUpload({ path: dropboxPath, contents: fileContent });
        // Return the response from the upload operation
        return fileUploaded;
    } catch (error) {
        // Log any errors that occur
        console.error('Error uploading file:', error);
        throw error; // Rethrow the error to propagate it further
    }
}

// Self-invoking asynchronous function to execute the file operations
(async () => {
    try {
        // Get and log the list of all files at the Dropbox root
        const filesList = await getAllFiles("");
        console.log('Files list:', filesList);

        // Upload a file and log the result
        const fileUploaded = await uploadFile("./hello.txt", "/hello.txt");//file name is given here
        console.log('File uploaded:', fileUploaded);

        // Get and log the list of all files again to see the changes
        const filesList2 = await getAllFiles("");
        console.log('Files list after upload:', filesList2);
    } catch (error) {
        // Log any errors that occur during the execution of file operations
        console.error('Error:', error);
    }
})();
