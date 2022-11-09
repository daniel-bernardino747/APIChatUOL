import Joi from 'joi';

export const schemaParticipant = Joi.object({
  name: Joi.string()
    .min(1)
    .max(30)
    .required(),

  lastStatus: Joi.date()
    .timestamp('javascript')
    .required(),
});

export const schemaBla = 'bla';
