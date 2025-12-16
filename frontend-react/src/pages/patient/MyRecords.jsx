import React, { useState, useEffect } from 'react';
import { FileText, Upload, Download, Trash2, Eye } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MyRecords = () => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchDocuments();
        }
    }, [user?.id]);

    const fetchDocuments = async () => {
        try {
            const response = await api.get(`/documents/patient/${user.id}`);
            const mappedDocs = response.data.map(doc => ({
                id: doc.id,
                name: doc.originalName || doc.fileName, // Display original name if available
                fileName: doc.fileName, // Needed for download
                date: doc.uploadedAt ? new Date(doc.uploadedAt).toISOString().split('T')[0] : 'Unknown',
                type: 'Uploaded Document',
                size: '-' // Size not stored in DB currently
            }));
            setDocuments(mappedDocs);
        } catch (error) {
            console.error("Failed to fetch documents", error);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user?.id) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("patientId", user.id);

        try {
            const response = await api.post("/documents/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const newDoc = response.data;

            // Add new doc to list immutably
            setDocuments(prev => [{
                id: newDoc.id,
                name: newDoc.originalName || newDoc.fileName,
                fileName: newDoc.fileName,
                date: new Date().toISOString().split('T')[0],
                type: 'Uploaded Document',
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB' // We know size for the just-uploaded one
            }, ...prev]);

        } catch (error) {
            console.error("Upload failed", error);
            const msg = error.response?.data?.message || error.message || "Unknown error";
            alert(`Failed to upload document: ${msg}\nStatus: ${error.response?.status}`);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            // Optimistic update
            setDocuments(prev => prev.filter(d => d.id !== id));
            try {
                await api.delete(`/documents/${id}`);
            } catch (error) {
                console.warn("Delete API failed", error);
                // create fallback to fetch if needed or revert
                fetchDocuments();
            }
        }
    };

    const handleDownload = async (fileName, originalName) => {
        try {
            const response = await api.get(`/documents/download/${fileName}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', originalName || fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
            alert("Failed to download file. It may be missing or you lack permissions.");
        }
    };

    const handleView = async (fileName) => {
        try {
            const response = await api.get(`/documents/download/${fileName}`, {
                responseType: 'blob',
            });
            const file = new Blob([response.data], { type: 'application/pdf' }); // Attempt to hint PDF, browser will auto-detect usually
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
        } catch (error) {
            console.error("View failed", error);
            alert("Failed to open file.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-surface-900">Medical Records</h2>
                    <p className="text-surface-500">View and manage your health documents</p>
                </div>

                <div className="relative">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleUpload}
                    />
                    <label
                        htmlFor="file-upload"
                        className={`flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 cursor-pointer transition-colors ${uploading ? 'opacity-75 cursor-wait' : ''}`}
                    >
                        {uploading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Upload className="w-5 h-5" />
                        )}
                        <span>{uploading ? 'Uploading...' : 'Upload New'}</span>
                    </label>
                </div>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                <div className="min-w-full divide-y divide-surface-100">
                    {/* Header */}
                    <div className="bg-surface-50 px-6 py-3 flex text-xs font-semibold text-surface-500 uppercase tracking-wider">
                        <div className="flex-1">Document Name</div>
                        <div className="w-32">Type</div>
                        <div className="w-32">Date</div>
                        <div className="w-24">Size</div>
                        <div className="w-32 text-right">Actions</div>
                    </div>

                    {/* Rows */}
                    {documents.length === 0 ? (
                        <div className="px-6 py-8 text-center text-surface-500 text-sm">
                            No documents found. Upload one above!
                        </div>
                    ) : (
                        documents.map((doc) => (
                            <div key={doc.id} className="px-6 py-4 flex items-center hover:bg-surface-50 transition-colors">
                                <div className="flex-1 flex items-center space-x-3">
                                    <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-surface-900">{doc.name}</span>
                                </div>
                                <div className="w-32 text-sm text-surface-600">{doc.type}</div>
                                <div className="w-32 text-sm text-surface-500">{doc.date}</div>
                                <div className="w-24 text-sm text-surface-500">{doc.size}</div>
                                <div className="w-32 flex justify-end space-x-2">
                                    <button
                                        onClick={() => handleDownload(doc.fileName, doc.name)}
                                        className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleView(doc.fileName)}
                                        className="p-2 text-surface-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                                        title="View"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="p-2 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyRecords;
