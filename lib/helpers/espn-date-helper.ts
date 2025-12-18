import * as DateFns from 'date-fns';
import { enUS } from 'date-fns/locale';
import { SmartDate } from './smart-date';

const FASTCAST_DATE_SHORT = 'EEE h:mm a';

export class EspnDateHelper extends SmartDate {
  tickerDate(time: number): string {
    return DateFns.format(time, FASTCAST_DATE_SHORT, { locale: enUS });
  }
}
