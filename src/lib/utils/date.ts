import { Timestamp } from 'firebase-admin/firestore';

export const createServerTimestamp = () => Timestamp.now();

export const convertToTimestamp = (date: Date) => Timestamp.fromDate(date);

export const convertFromTimestamp = (timestamp: Timestamp) => timestamp.toDate(); 