export interface Documento {
  id: number;
  nomeArquivo: string;
  dataRecebimento: string; // ISO format: "2025-01-10T09:30:00"
  origem: 'WhatsApp' | 'Upload painel';
  tipo: 'Pessoal' | 'Cadastro da fazenda' | 'Contratos' | 'Comprovantes de pagamento' | 'Ambiental / ESG / EUDR' | 'Técnico' | 'Outros';
  tamanho: string; // ex: "1.2 MB"
  formato: string; // ex: "PDF", "JPG", "PNG", "DOC"
  validade?: string; // ISO date: "2026-01-10"
  descricao?: string;
}

export const mockDocumentos: Documento[] = [
  {
    id: 1,
    nomeArquivo: 'CAR_FazendaBoaVista_2025-01-10.pdf',
    dataRecebimento: '2025-01-10T09:30:00',
    origem: 'WhatsApp',
    tipo: 'Cadastro da fazenda',
    tamanho: '1.2 MB',
    formato: 'PDF',
    validade: '2026-01-10',
    descricao: 'Certificado de Cadastro Ambiental Rural (CAR) da Fazenda Boa Vista',
  },
  {
    id: 2,
    nomeArquivo: 'CCIR_2025_FazendaBoaVista.pdf',
    dataRecebimento: '2025-02-05T14:00:00',
    origem: 'Upload painel',
    tipo: 'Cadastro da fazenda',
    tamanho: '750 KB',
    formato: 'PDF',
    validade: '2030-02-05',
    descricao: '',
  },
  {
    id: 3,
    nomeArquivo: 'Recibo_pagamento_Jan2025.jpg',
    dataRecebimento: '2025-01-20T11:10:00',
    origem: 'WhatsApp',
    tipo: 'Comprovantes de pagamento',
    tamanho: '820 KB',
    formato: 'JPG',
  },
  {
    id: 4,
    nomeArquivo: 'CPF_Gabriel_Carvalho.pdf',
    dataRecebimento: '2024-12-15T08:45:00',
    origem: 'Upload painel',
    tipo: 'Pessoal',
    tamanho: '450 KB',
    formato: 'PDF',
    validade: '2035-06-20',
    descricao: 'CPF do produtor responsável',
  },
  {
    id: 5,
    nomeArquivo: 'ITR_2024.pdf',
    dataRecebimento: '2025-01-25T10:20:00',
    origem: 'WhatsApp',
    tipo: 'Cadastro da fazenda',
    tamanho: '2.5 MB',
    formato: 'PDF',
    validade: '2025-12-31',
    descricao: 'Imposto Territorial Rural - ITR 2024',
  },
  {
    id: 6,
    nomeArquivo: 'Laudo_Solo_2024.pdf',
    dataRecebimento: '2024-11-10T13:15:00',
    origem: 'Upload painel',
    tipo: 'Técnico',
    tamanho: '1.8 MB',
    formato: 'PDF',
    descricao: 'Análise de solo da área cultivada - 2024',
  },
  {
    id: 7,
    nomeArquivo: 'RG_Gabriel_Carvalho.jpg',
    dataRecebimento: '2024-10-05T09:00:00',
    origem: 'WhatsApp',
    tipo: 'Pessoal',
    tamanho: '650 KB',
    formato: 'JPG',
    validade: '2030-10-05',
  },
  {
    id: 8,
    nomeArquivo: 'Contrato_Financiamento_BB.pdf',
    dataRecebimento: '2025-03-10T11:30:00',
    origem: 'Upload painel',
    tipo: 'Contratos',
    tamanho: '3.2 MB',
    formato: 'PDF',
    validade: '2032-03-10',
    descricao: 'Contrato de financiamento com Banco do Brasil para custeio 2025',
  },
  {
    id: 9,
    nomeArquivo: 'Certificado_Sustentabilidade.pdf',
    dataRecebimento: '2025-01-15T14:45:00',
    origem: 'WhatsApp',
    tipo: 'Ambiental / ESG / EUDR',
    tamanho: '1.1 MB',
    formato: 'PDF',
    validade: '2026-01-15',
    descricao: 'Certificação de Sustentabilidade - EUDR Compliance',
  },
  {
    id: 10,
    nomeArquivo: 'Comprovante_Pagamento_Fev2025.jpg',
    dataRecebimento: '2025-02-10T09:25:00',
    origem: 'WhatsApp',
    tipo: 'Comprovantes de pagamento',
    tamanho: '905 KB',
    formato: 'JPG',
  },
];
