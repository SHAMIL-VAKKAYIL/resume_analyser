import React from 'react'
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useParams } from 'react-router-dom';

import { UPLOAD_BASE_URL } from '../../api/axios';

function ResumeViewer() {

    const { filename } = useParams();


    return (
        // <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <div style={{
            border: '1px solid rgba(0, 0, 0, 0.3)',
            height: '750px',
        }}>
            <Viewer fileUrl={`${UPLOAD_BASE_URL}/resumes/${filename}`} />;
        </div>
        // </Worker>
    )
}

export default ResumeViewer
