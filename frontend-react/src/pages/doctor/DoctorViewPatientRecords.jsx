import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, Eye, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

const DoctorViewPatientRecords = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [patientName, setPatientName] = useState('Patient');

    useEffect(() => {
        fetchPatientDetails();
        fetchDocuments();
    }, [patientId]);

    const fetchPatientDetails = async () => {
        try {
            const response = await api.get(`/patients/${patientId}`);
            setPatientName(response.data.name);
        } catch (error) {
            console.error("Failed to fetch patient details", error);
        }
    };

    const fetchDocuments = async () => {
        try {
            const response = await api.get(`/documents/patient/${patientId}`);
            const mappedDocs = response.data.map(doc => ({
                id: doc.id,
                name: doc.originalName || doc.fileName,
                fileName: doc.fileName,
                date: doc.uploadedAt ? new Date(doc.uploadedAt).toISOString().split('T')[0] : 'Unknown',
                type: 'Uploaded Document',
                size: '-'
            }));
            setDocuments(mappedDocs);
        } catch (error) {
            console.error("Failed to fetch documents", error);
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
            alert("Error al descargar archivo.");
        }
    };

    const handleView = async (fileName) => {
        try {
            const response = await api.get(`/documents/download/${fileName}`, {
                responseType: 'blob',
            });
            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
        } catch (error) {
            console.error("View failed", error);
            alert("Error al abrir archivo.");
        }
    };

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/patients')}
                className="flex items-center text-surface-500 hover:text-primary-600 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Pacientes
            </button>

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-surface-900">Historial Médico</h2>
                    <p className="text-surface-500">Documentos de {patientName}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                <div className="min-w-full divide-y divide-surface-100">
                    <div className="bg-surface-50 px-6 py-3 flex text-xs font-semibold text-surface-500 uppercase tracking-wider">
                        <div className="flex-1">Nombre del Documento</div>
                        <div className="w-32">Tipo</div>
                        <div className="w-32">Fecha</div>
                        <div className="w-32 text-right">Acciones</div>
                    </div>

                    {documents.length === 0 ? (
                        <div className="px-6 py-8 text-center text-surface-500 text-sm">
                            No se encontraron documentos para este paciente.
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
                                <div className="w-32 flex justify-end space-x-2">
                                    <button
                                        onClick={() => handleDownload(doc.fileName, doc.name)}
                                        className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                        title="Descargar"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleView(doc.fileName)}
                                        className="p-2 text-surface-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                                        title="Ver"
                                    >
                                        <Eye className="w-4 h-4" />
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

export default DoctorViewPatientRecords;
