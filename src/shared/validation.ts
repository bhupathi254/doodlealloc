import Joi from '@hapi/joi';
import { Request, Response, NextFunction, response } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import { roles } from './constants';

/** Common Schema */
export const paginatedSchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).default(10),
    search: Joi.string().optional().allow('', null),
    sortBy: Joi.string().optional().allow('', null),
    sortKey: Joi.string().optional().allow('', null),
});

/** User Schema's */

/** Create User */
export const createUser = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().trim().required(),
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        contactNumber: Joi.string().trim().required(),
        dob: Joi.string().isoDate().optional(),
        gender: Joi.number().valid('Male','Female').default('Male')
    })
});

/** Login Schema */
export const loginSchema = Joi.object({
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
});

export const isProjectManagerId = Joi.object({
    projectManagerId: Joi.string().pattern(/^[0-9+]{7}-[0-9+]{1}$/).required()
});
/** Create Project Manager */
export const createProjectManager = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        contactNumber: Joi.string().trim().required(),
        dob: Joi.string().isoDate().optional(),
        role: Joi.string().valid('Project Manager').required(),
        gender: Joi.number().valid('Male', 'Female').default('Male'),
        _id: Joi.string().optional()
    }),
    status: Joi.string().valid('Active','Inactive').required(),
    doj: Joi.string().isoDate().optional().allow('', null)
});

const options = {
    basic: {
        abortEarly: false,
        convert: true,
        allowUnknown: false,
        stripUnknown: false
    },
    array: {
        abortEarly: false,
        convert: true,
        allowUnknown: true,
        stripUnknown: {
            objects: true
        }
    }
};

const joierrors = (req: Request, res: Response, err: any): Response<any> => {
    const error = err.details.reduce((prev: any, curr: any) => {
        prev[curr.path[0]] = curr.message.replace(/"/g, "");
        return prev;
    }, {});
    return res.status(BAD_REQUEST).json({
        error
    });
}

export const validate = (schema: Joi.ObjectSchema, responseType: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        type responseOptions = { [key: string]: any }
        const source: responseOptions = { params: req.params, body: req.body, query: req.query };
        const data = source[responseType];
        schema.validateAsync({ ...data }, options.basic).then(() => next(), errors => joierrors(req, res, errors));
    }
}

