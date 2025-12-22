/**
 * Risk detection patterns and keywords for clause analysis
 */

export const RISK_PATTERNS = {
  // HIGH RISK - Red Flags
  HIGH: {
    dataPrivacy: [
      'sell your data',
      'sell your information',
      'monetize.*data',
      'share.*third.{0,10}part',
      'disclose.*personal information',
      'transfer.*data.*affiliate',
    ],
    arbitration: [
      'forced arbitration',
      'binding arbitration',
      'waive.*right.*class action',
      'waive.*right.*jury trial',
      'mandatory arbitration',
    ],
    payment: [
      'non-refundable',
      'no refund',
      'cannot cancel',
      'auto.{0,5}renew',
      'automatically.*renew',
      'renewal.*automatic',
    ],
    rights: [
      'waive.*right',
      'surrender.*right',
      'forfeit.*right',
      'relinquish.*claim',
      'irrevocable.*license',
    ],
    liability: [
      'unlimited liability',
      'no warranty',
      'disclaim.*all.*warrant',
      'not responsible.*loss',
      'assume.*all.*risk',
    ],
    changes: [
      'change.*without notice',
      'modify.*sole discretion',
      'alter.*any time',
      'unilateral.*change',
    ],
  },

  // MEDIUM RISK - Yellow Flags
  MEDIUM: {
    dataRetention: [
      'retain.*indefinitely',
      'store.*data.*period',
      'keep.*information',
      'data retention',
    ],
    termination: [
      'terminate.*access',
      'suspend.*account',
      'disable.*service',
      'close.*account.*discretion',
    ],
    liability: [
      'limited liability',
      'as-is basis',
      'with all faults',
      'no guarantee',
      'best effort',
    ],
    changes: [
      'may change',
      'reserve.*right.*modify',
      'update.*time to time',
      'subject to change',
    ],
    thirdParty: [
      'third.{0,5}party',
      'partner.*service',
      'affiliate.*share',
      'vendor.*access',
    ],
  },

  // LOW RISK - Green Flags (positive indicators)
  LOW: {
    transparency: [
      'will notify you',
      'notice.*change',
      'inform.*advance',
      'prior.*notification',
    ],
    rights: [
      'right to cancel',
      'opt.{0,5}out',
      'unsubscribe',
      'delete.*account',
      'access.*data',
    ],
    compliance: [
      'GDPR',
      'CCPA',
      'privacy.*compliance',
      'data protection',
      'security measures',
    ],
  },
};

/**
 * Clause categories with their typical keywords
 */
export const CLAUSE_CATEGORIES = {
  'data-privacy': [
    'data',
    'information',
    'privacy',
    'personal',
    'collect',
    'process',
    'store',
  ],
  'payment': [
    'payment',
    'fee',
    'charge',
    'price',
    'subscription',
    'billing',
    'refund',
  ],
  'cancellation': [
    'cancel',
    'terminate',
    'end',
    'close',
    'discontinue',
    'withdrawal',
  ],
  'arbitration': [
    'arbitration',
    'dispute',
    'resolution',
    'mediation',
    'litigation',
    'court',
  ],
  'liability': [
    'liability',
    'responsible',
    'warranty',
    'guarantee',
    'damages',
    'indemnify',
  ],
  'intellectual-property': [
    'intellectual property',
    'copyright',
    'trademark',
    'patent',
    'license',
    'ownership',
  ],
  'termination': [
    'termination',
    'suspension',
    'account',
    'access',
    'disable',
    'revoke',
  ],
  'modification': [
    'modification',
    'change',
    'update',
    'amend',
    'revise',
    'alter',
  ],
};
