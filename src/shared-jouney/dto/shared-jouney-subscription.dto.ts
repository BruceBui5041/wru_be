import { SharedJouney } from '../shared-jouney.entity';

type EventType = 'insert' | 'change' | 'delete';

export class SharedJouneySubcriptionDto {
  constructor(event: EventType, data: SharedJouney) {
    this.event = event;
    this.data = data;
  }

  event: EventType;
  data: SharedJouney;
}
