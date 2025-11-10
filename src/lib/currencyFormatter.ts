// src/lib/currencyFormatter.ts

/**
 * Formata um valor numérico para o formato de moeda brasileira (R$ 1.000,00)
 * @param value - Valor decimal (ex: 1234.56)
 * @returns String formatada no padrão brasileiro (ex: "R$ 1.234,56")
 */
export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
};

/**
 * Remove formatação de moeda e retorna apenas os dígitos
 * @param value - String formatada (ex: "R$ 1.234,56")
 * @returns String com apenas números (ex: "123456")
 */
export const unformatCurrency = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Converte string de centavos para valor decimal
 * @param cents - String com centavos (ex: "123456" representa R$ 1.234,56)
 * @returns Número decimal (ex: 1234.56)
 */
export const centsToDecimal = (cents: string): number => {
  const numCents = parseInt(cents || '0', 10);
  return numCents / 100;
};

/**
 * Converte valor decimal para centavos
 * @param value - Valor decimal (ex: 1234.56)
 * @returns Número inteiro em centavos (ex: 123456)
 */
export const decimalToCents = (value: number): number => {
  return Math.round(value * 100);
};

/**
 * Formata o input enquanto o usuário digita
 * Implementação otimizada para BRL: usuário digita números e vê formatação automática
 * Exemplo: digita "12345" e vê "R$ 123,45"
 *
 * @param value - Valor atual do input (pode conter formatação ou não)
 * @returns Objeto com valor formatado para exibição e valor numérico correto
 */
export const formatCurrencyInput = (value: string): {
  formatted: string;
  numeric: number;
  rawCents: string;
} => {
  // Remove tudo que não for número
  const onlyNumbers = unformatCurrency(value);

  // Se vazio, retorna 0
  if (!onlyNumbers || onlyNumbers === '0') {
    return {
      formatted: 'R$ 0,00',
      numeric: 0,
      rawCents: '0'
    };
  }

  // Remove zeros à esquerda, mas mantém pelo menos um dígito
  const cleanedNumbers = onlyNumbers.replace(/^0+/, '') || '0';

  // Converte para centavos e depois para valor decimal correto
  // Exemplo: "12345" -> 123.45
  const numericValue = centsToDecimal(cleanedNumbers);

  // Formata para exibição usando a função padrão de formatação
  const formatted = formatCurrency(numericValue);

  return {
    formatted,
    numeric: numericValue,
    rawCents: cleanedNumbers
  };
};

/**
 * Converte um valor salvo no banco de dados para formato de exibição no input
 * @param dbValue - Valor do banco (pode ser number ou string)
 * @returns Objeto com valores formatados para uso no input
 */
export const initializeCurrencyInput = (dbValue: string | number | null | undefined): {
  formatted: string;
  numeric: number;
  rawCents: string;
} => {
  if (dbValue === null || dbValue === undefined || dbValue === '') {
    return {
      formatted: 'R$ 0,00',
      numeric: 0,
      rawCents: '0'
    };
  }

  const numValue = typeof dbValue === 'string' ? parseFloat(dbValue) : dbValue;

  if (isNaN(numValue) || numValue === 0) {
    return {
      formatted: 'R$ 0,00',
      numeric: 0,
      rawCents: '0'
    };
  }

  // Converte o valor decimal para centavos para manter consistência
  const cents = decimalToCents(numValue);

  return {
    formatted: formatCurrency(numValue),
    numeric: numValue,
    rawCents: cents.toString()
  };
};

/**
 * Hook de React para gerenciar input de moeda com comportamento otimizado
 * @param initialValue - Valor inicial (number ou string do banco de dados)
 * @returns Objeto com valores e funções para gerenciar o input
 */
export const useCurrencyInput = (initialValue: string | number = 0) => {
  const getInitialState = () => {
    if (typeof initialValue === 'number') {
      return initializeCurrencyInput(initialValue);
    }
    if (initialValue === '' || initialValue === '0') {
      return {
        formatted: 'R$ 0,00',
        numeric: 0,
        rawCents: '0'
      };
    }
    return initializeCurrencyInput(initialValue);
  };

  const initialState = getInitialState();
  const [displayValue, setDisplayValue] = React.useState<string>(initialState.formatted);
  const [numericValue, setNumericValue] = React.useState<number>(initialState.numeric);

  const handleChange = (inputValue: string) => {
    const result = formatCurrencyInput(inputValue);
    setDisplayValue(result.formatted);
    setNumericValue(result.numeric);
    return result;
  };

  const setValue = (value: number) => {
    const result = initializeCurrencyInput(value);
    setDisplayValue(result.formatted);
    setNumericValue(result.numeric);
  };

  return {
    displayValue,
    numericValue,
    handleChange,
    setValue,
    reset: () => {
      setDisplayValue('R$ 0,00');
      setNumericValue(0);
    }
  };
};

// Adiciona React ao escopo para o hook
import React from 'react';
