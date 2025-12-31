import {
  BadRequestException,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { FileValidationProps } from '../types/global-types';
import { getMetadataArgsStorage } from 'typeorm';

const handleDbErrors = (err: { number: number; }) => {
  //foreign key voiation error
  if (err.number === 547) {
    // Handle foreign key violation error here
    throw new BadRequestException('Invalid Foreign Key');
  }
  //duplicate value
  else if (err.number === 2627 || err.number === 2601) {
    throw new BadRequestException('DB duplicate error value already exists');
  }
};

export const handleErrorCatch = (err:any) => {
  console.log(err);
  const logger = new Logger();
  logger.error(err);
  // console.log(err)
  handleDbErrors(err);

  if (
    err.status === HttpStatus.NOT_FOUND ||
    err.status === HttpStatus.BAD_REQUEST ||
    err.status === HttpStatus.UNAUTHORIZED ||
    err.status === HttpStatus.FORBIDDEN ||
    err.status === HttpStatus.CONFLICT
  ) {
    throw new HttpException(
      {
        status: err.status,
        message:
          err.response.message ||
          err.response.data.message ||
          err.response.error,
        error: err.response.error,
      },
      err.status,
    );
  }

  const message = err.message;

  throw new HttpException(
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: `An error occured with the message: ${err.message}`,
      message: message,
      errorType: 'Internal server error',
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};

export const decodeBase64Image = (
  base64String: string,
): { buffer: Buffer; mimetype: string } => {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const mimetype = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');

  return { buffer, mimetype };
};

export const convertToHighestCurrencyDenomination = (
  amount: number,
): number => {
  return amount / 100;
};

export const convertToLowestCurrencyDenomination = (amount: number): number => {
  return amount * 100;
};

export const generateOTP = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};


export const validateFile = ({
  files,
  maxFileSize,
  supportedFormats,
}: FileValidationProps) => {
  if (!files.length) {
    throw new BadRequestException('no file detected');
  }

  files.forEach((file) => {
    const checkFormat = supportedFormats.find(
      (format) => format == file.mimetype,
    );

    if (!checkFormat) {
      throw new BadRequestException('file format not supported');
    }

    //900kb 900 000
    if (file.size > maxFileSize) {
      throw new BadRequestException(file.originalname + ' is too large');
    }
  });

  return true;
};


export const getKeyFromUrl = (url: string): string => {
  // Check if the URL has a protocol and domain structure
  if (url.includes('://')) {
    // Split by the domain which is usually followed by the first "/" after the protocol
    const parts = url.split(/\/\//)[1].split(/\/(.+)/);
    if (parts.length > 1) {
      return parts[1];
    }
    return '';
  }

  // If no protocol is found, just return the string as is or handle accordingly
  return url;
};

export const getEntityColumns = (entityClass: any): Record<string, boolean> => {
  const metadata = getMetadataArgsStorage();
  const columns = metadata.columns.filter(
    (column) => column.target === entityClass,
  );

  const fields: Record<string, boolean> = {};
  columns.forEach((column) => {
    if (typeof column.propertyName === 'string') {
      fields[column.propertyName] = true;
    }
  });

  return fields;
};


export const validateFilesGeneric = (files: Express.Multer.File[]) => {
  validateFile({
    files,
    maxFileSize: 50 * 1024 * 1024, // 50 MB
    supportedFormats: [
      'image/jpeg',
      'image/png',
      'video/mp4',
      'video/quicktime',
    ],
  });
};