import { Inject, Injectable } from '@nestjs/common';
import { SeqLogger } from './interfaces';
import { JASONSOFT_SEQ_LOGGER } from './jasonsoft-seq.constants';
import * as os from 'os';
import { SeqLogLevel, SeqEvent } from 'seq-logging';

/**
 * JasonSoft Seq Logger Service
 * Added by Jason.Song (成长的小猪) on 2021/07/05 16:59:39
 */
@Injectable()
export class JasonSoftSeqService {
  constructor(
    @Inject(JASONSOFT_SEQ_LOGGER) private readonly seqLogger: SeqLogger,
  ) {}

  public verbose(messageTemplate: string, properties?: object) {
    this.commit('Verbose', messageTemplate, properties);
  }

  public debug(messageTemplate: string, properties?: object) {
    this.commit('Debug', messageTemplate, properties);
  }

  public info(messageTemplate: string, properties?: object) {
    this.commit('Information', messageTemplate, properties);
  }

  public warn(messageTemplate: string, properties?: object) {
    this.commit('Warning', messageTemplate, properties);
  }

  public error(messageTemplate: string, properties?: object | Error) {
    this.commit('Error', messageTemplate, properties);
  }

  public fatal(messageTemplate: string, properties?: object) {
    this.commit('Fatal', messageTemplate, properties);
  }

  /**
   * Fix the error that properties are not assigned
   * Updated by Jason.Song (成长的小猪) on 2021/09/08 11:29:21
   * @param level
   * @param messageTemplate
   * @param properties
   */
  private commit(
    level: SeqLogLevel,
    messageTemplate: string,
    properties?: any,
  ) {
    let { stack, ...props } = properties || {};
    const seqEvent: SeqEvent = {
      timestamp: new Date(),
      level,
      messageTemplate,
      properties: {
        serviceName: this.seqLogger.serviceName,
        hostname: os.hostname(),
        ...props,
      },
      exception: stack ? stack : undefined,
    };
    try {
      this.seqLogger.logger.emit(seqEvent);
    } catch (error) {
      console.error(error, seqEvent);
    }
  }
}