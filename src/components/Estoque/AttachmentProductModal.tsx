// src/components/Estoque/AttachmentProductModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Download,
  Upload,
  Trash2,
  FileText,
  AlertCircle,
  CheckCircle,
  File,
  Image as ImageIcon
} from 'lucide-react';
import { AttachmentProductService, AttachmentFile } from '../../services/attachmentProductService';

interface AttachmentProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

export default function AttachmentProductModal({ 
  isOpen, 
  onClose, 
  productId, 
  productName
}: AttachmentProductModalProps) {
  // Estado para confirmação customizada
  const [confirmState, setConfirmState] = useState<{
    type: 'delete-image' | 'delete-pdf' | 'replace-image' | 'replace-pdf' | null;
    onConfirm?: () => void;
  }>({ type: null });
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAttachments([]); // Limpa anexos antigos
      setMessage(null);   // Limpa mensagens antigas
      checkAttachments();
      console.log('🆔 Modal aberto para produto ID:', productId);
    }
  }, [isOpen, productId]);

  const checkAttachments = async () => {
    try {
      setLoading(true);
      console.log('🔄 Verificando anexos para produto:', productId);
      const files = await AttachmentProductService.listAttachments(productId);
      setAttachments(files);
    } catch (error) {
      console.error('Erro ao listar anexos:', error);
      setMessage({ type: 'error', text: 'Erro ao listar anexos' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (type: 'image' | 'pdf') => {
    try {
      setLoading(true);
      setMessage(null);
  await AttachmentProductService.downloadAttachment(productId, type === 'pdf' ? 'pdf' : 'jpg');
      setMessage({ type: 'success', text: 'Download iniciado com sucesso!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erro ao fazer download' 
      });
    } finally {
      setLoading(false);
    }
  };


  // Adicionar/substituir imagem/pdf: confirmação só para substituir
  const handleImageSelect = (isReplace = false) => {
    if (isReplace) {
      setConfirmState({
        type: 'replace-image',
        onConfirm: () => {
          setConfirmState({ type: null });
          imageInputRef.current?.click();
        }
      });
    } else {
      imageInputRef.current?.click();
    }
  };
  const handlePdfSelect = (isReplace = false) => {
    if (isReplace) {
      setConfirmState({
        type: 'replace-pdf',
        onConfirm: () => {
          setConfirmState({ type: null });
          pdfInputRef.current?.click();
        }
      });
    } else {
      pdfInputRef.current?.click();
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      setMessage(null);
      const error = AttachmentProductService.validateFile(file);
      if (error) {
        setMessage({ type: 'error', text: error });
        return;
      }
      await AttachmentProductService.uploadAttachment(productId, file);
      setMessage({ type: 'success', text: 'Imagem salva com sucesso!' });
      await checkAttachments();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Erro ao processar imagem' });
    } finally {
      setLoading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handlePdfChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      setMessage(null);
      const error = AttachmentProductService.validateFile(file);
      if (error) {
        setMessage({ type: 'error', text: error });
        return;
      }
      await AttachmentProductService.uploadAttachment(productId, file);
      setMessage({ type: 'success', text: 'Arquivo PDF salvo com sucesso!' });
      await checkAttachments();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Erro ao processar arquivo' });
    } finally {
      setLoading(false);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
    }
  };


  // Excluir individualmente imagem ou PDF
  const handleDeleteImage = () => {
    setConfirmState({
      type: 'delete-image',
      onConfirm: async () => {
        setConfirmState({ type: null });
        try {
          setLoading(true);
          setMessage(null);
          await AttachmentProductService.deleteSingleAttachment(productId, 'jpg');
          setMessage({ type: 'success', text: 'Imagem excluída!' });
          await checkAttachments();
        } catch (error) {
          setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Erro ao excluir imagem' });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleDeletePdf = () => {
    setConfirmState({
      type: 'delete-pdf',
      onConfirm: async () => {
        setConfirmState({ type: null });
        try {
          setLoading(true);
          setMessage(null);
          await AttachmentProductService.deleteSingleAttachment(productId, 'pdf');
          setMessage({ type: 'success', text: 'Arquivo PDF excluído!' });
          await checkAttachments();
        } catch (error) {
          setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Erro ao excluir arquivo' });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const getFileIcon = (fileType: 'image' | 'pdf') => {
    if (fileType === 'pdf') return FileText;
    return File;
  };

  const getFileTypeLabel = (fileType: 'image' | 'pdf') => {
    if (fileType === 'pdf') return 'PDF anexado';
    return 'Arquivo anexado';
  };

  const getFileIconColor = (fileType: 'image' | 'pdf') => {
    if (fileType === 'pdf') return 'text-orange-600';
    return 'text-gray-600';
  };

  const imageAttachment = attachments.find(a => a.type === 'image');
  const pdfAttachment = attachments.find(a => a.type === 'pdf');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      {/* Modal de confirmação customizado */}
      {confirmState.type && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,68,23,0.1)] max-w-sm w-full p-6 flex flex-col items-center">
            <AlertCircle className="w-8 h-8 text-[#F7941F] mb-2" />
            <p className="text-[14px] text-center mb-4 text-[#004417] font-medium">
              Atenção: ao confirmar, o arquivo{confirmState.type.startsWith('replace') ? ' atual' : ''} será excluído de forma definitiva do Painel da Fazenda e do nosso banco de dados. Deseja continuar?
            </p>
            <div className="flex gap-3 mt-2">
              <button
                className="px-6 py-2 rounded-xl bg-[rgba(0,68,23,0.05)] text-[#004417] hover:bg-[rgba(0,68,23,0.08)] font-semibold transition-all"
                onClick={() => setConfirmState({ type: null })}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="px-6 py-2 rounded-xl bg-[rgba(247,148,31,0.1)] text-[#F7941F] hover:bg-[rgba(247,148,31,0.15)] font-semibold transition-all"
                onClick={confirmState.onConfirm}
                disabled={loading}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-[16px] shadow-[0_4px_12px_rgba(0,68,23,0.1)] max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-[18px] font-bold text-[#004417] mb-1">Gerenciar Anexos</h3>
            <p className="text-[14px] text-[rgba(0,68,23,0.7)] truncate max-w-64">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[rgba(0,68,23,0.55)] hover:text-[#00A651] rounded-lg transition-colors"
            disabled={loading}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensagem de feedback */}
        {message && (
          <div className={`mb-5 rounded-xl border px-4 py-3 flex items-center gap-2 text-[13px] font-medium ${
            message.type === 'success'
              ? 'bg-[rgba(0,166,81,0.08)] border-[rgba(0,166,81,0.2)] text-[#004417]'
              : 'bg-[rgba(247,148,31,0.08)] border-[rgba(247,148,31,0.25)] text-[#004417]'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-[#00A651]" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#F7941F]" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Área de anexos */}
        <div className="mb-6 space-y-5">
          <div className="space-y-3">
            <button
              className="flex items-center justify-center gap-3 h-12 rounded-xl bg-[#00A651] text-white text-[15px] font-semibold shadow-[0_2px_6px_rgba(0,68,23,0.12)] hover:bg-[#004417] transition-colors disabled:opacity-60"
              onClick={() => handleImageSelect(Boolean(imageAttachment))}
              disabled={loading}
            >
              <ImageIcon className="w-5 h-5" /> Anexar Imagem
            </button>
            <button
              className="flex items-center justify-center gap-3 h-12 rounded-xl bg-[#004417] text-white text-[15px] font-semibold shadow-[0_2px_6px_rgba(0,68,23,0.12)] hover:bg-[#006F2E] transition-colors disabled:opacity-60"
              onClick={() => handlePdfSelect(Boolean(pdfAttachment))}
              disabled={loading}
            >
              <FileText className="w-5 h-5" /> Anexar Arquivo
            </button>
          </div>

          {imageAttachment && (
            <div className="rounded-xl border border-[rgba(0,68,23,0.08)] bg-[rgba(0,68,23,0.02)] p-4 space-y-4">
              <div className="flex flex-col items-center gap-3">
                <img
                  src={imageAttachment.url}
                  alt="Imagem anexada"
                  className="max-h-40 rounded-lg border border-[rgba(0,68,23,0.1)] object-contain"
                />
                <span className="text-[13px] text-[rgba(0,68,23,0.75)]">Pré-visualização do arquivo enviado</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(0,68,23,0.12)] bg-white text-[#004417] text-[13px] font-semibold hover:bg-[rgba(0,68,23,0.05)] transition-colors"
                  onClick={() => handleDownload('image')}
                  disabled={loading}
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(0,166,81,0.12)] text-[#00A651] text-[13px] font-semibold hover:bg-[rgba(0,166,81,0.18)] transition-colors"
                  onClick={() => handleImageSelect(true)}
                  disabled={loading}
                >
                  <Upload className="w-4 h-4" /> Substituir Imagem
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(247,148,31,0.12)] text-[#F7941F] text-[13px] font-semibold hover:bg-[rgba(247,148,31,0.18)] transition-colors"
                  onClick={handleDeleteImage}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" /> Excluir Imagem
                </button>
              </div>
            </div>
          )}

          {pdfAttachment && (
            <div className="rounded-xl border border-[rgba(0,68,23,0.08)] bg-[rgba(0,68,23,0.02)] p-4 space-y-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const FileIcon = getFileIcon(pdfAttachment.type);
                  const iconColor = getFileIconColor(pdfAttachment.type);
                  const fileLabel = getFileTypeLabel(pdfAttachment.type);
                  return (
                    <>
                      <div className={`${iconColor} flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[rgba(0,68,23,0.08)]`}>
                        <FileIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[13px] text-[rgba(0,68,23,0.7)]">Arquivo disponível</p>
                        <strong className="text-[#004417] text-[15px]">{fileLabel}</strong>
                      </div>
                    </>
                  );
                })()}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(0,68,23,0.12)] bg-white text-[#004417] text-[13px] font-semibold hover:bg-[rgba(0,68,23,0.05)] transition-colors"
                  onClick={() => handleDownload('pdf')}
                  disabled={loading}
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(0,166,81,0.12)] text-[#00A651] text-[13px] font-semibold hover:bg-[rgba(0,166,81,0.18)] transition-colors"
                  onClick={() => handlePdfSelect(true)}
                  disabled={loading}
                >
                  <Upload className="w-4 h-4" /> Substituir Arquivo
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(247,148,31,0.12)] text-[#F7941F] text-[13px] font-semibold hover:bg-[rgba(247,148,31,0.18)] transition-colors"
                  onClick={handleDeletePdf}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" /> Excluir Arquivo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Inputs ocultos */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/svg+xml,image/avif"
          onChange={handleImageChange}
          className="hidden"
        />
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf,application/xml,text/xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,text/plain"
          onChange={handlePdfChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
