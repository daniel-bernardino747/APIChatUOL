import Joi from 'joi';

const schemaMessage = Joi.object({
  to: Joi.string()
    .min(1)
    .required(),

  text: Joi.string()
    .min(1)
    .required(),

  type: Joi.string()
    .valid('message', 'private_message')
    .required(),

  from: Joi.string()
    .required(),

  time: Joi.string()
    .required(),
});

const schemaUpdateMessage = Joi.object({
  to: Joi.string()
    .min(1)
    .required(),

  text: Joi.string()
    .min(1)
    .required(),

  type: Joi.string()
    .valid('message', 'private_message')
    .required(),
});

export { schemaMessage, schemaUpdateMessage };
