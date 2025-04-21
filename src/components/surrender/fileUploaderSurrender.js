import React, { useState } from 'react';

const FileUploader = ({ onFilesUploaded }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    onFilesUploaded(selectedFiles.map(file => ({
      nombreArchivo: file.name,
      url: URL.createObjectURL(file),
    })));
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {files.length > 0 && (
        <ul className="mt-2">
          {files.map((file, index) => (
            <li key={index} className="text-sm text-gray-600">{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;