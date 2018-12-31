export type eventLevel = 'error' | 'warning' | 'info';

export interface ApplicationEvent {
  eventId: string; // date ticks
  date: Date;
  source: string;
  level: eventLevel;
  message: string;
  data: any | null;
}

export function createEvent(
  source: string,
  message: string,
  data: any
): ApplicationEvent {
  const now = new Date();
  return {
    eventId: now.getTime() + '',
    date: now,
    level: 'info',
    source: source,
    message: message,
    data: data
  };
}
export function createInfo(
  source: string,
  message: string,
  data: any
): ApplicationEvent {
  return { ...createEvent(source, message, data), level: 'info' };
}

export function createWarning(
  source: string,
  message: string,
  data: any
): ApplicationEvent {
  return { ...createEvent(source, message, data), level: 'warning' };
}

export function createError(
  source: string,
  message: string,
  data: any
): ApplicationEvent {
  return { ...createEvent(source, message, data), level: 'error' };
}
