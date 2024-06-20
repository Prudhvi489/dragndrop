// src/PreviewPage.js
import React, { useEffect, useState } from 'react';

const PreviewPage = () => {
  const [previewData, setPreviewData] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('previewData')) || [];
    setPreviewData(data);
  }, []);

  return (
    <div>
      <h2>Preview</h2>
      {previewData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Label</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {previewData.map((item, index) => (
              <tr key={index}>
                <td>Item {index + 1}</td>
                <td>{item.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data to preview.</p>
      )}
    </div>
  );
};

export default PreviewPage;
