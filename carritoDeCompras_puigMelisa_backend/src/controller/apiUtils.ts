import { Request, Response, NextFunction } from 'express';

type APIResponse = {
  success: boolean;
  error?: string;
  errorCode?: string;
  payload?: unknown;
  reload?: boolean;
};

class APIUtils {
  constructor() {
    this.handleError = this.handleError.bind(this);
  }

  sendResponse(res: Response, payload: unknown, code = 200): boolean {
    const send: APIResponse = {
      payload,
      success: true,
    };
    res.statusCode = code;
    res.json(send);
    return true;
  }

  sendError(_req: Request, res: Response, error: Error, code = 500): boolean {
    let errorCode = code;
    switch (error.message) {
      case 'INVALID_PARAMS':
        errorCode = 403;
        break;
      case 'METHOD_NOT_FOUND':
        errorCode = 404;
        break;
      case 'ELEMENT_NOT_FOUND':
        errorCode = 404;
        break;

      default:
        errorCode = code;
    }
    if (error.message === 'INVALID_PARAMS') {
    }
    const response: APIResponse = {
      success: false,
      error: error.message,
    };
    res.statusCode = errorCode;
    res.json(response);
    return false;
  }

  sendMethodNotFound(_req: Request, _res: Response, next: NextFunction): void {
    const error = new Error(`METHOD_NOT_FOUND`);
    next(error);
  }

  handleError(err: Error, req: Request, res: Response, _next: NextFunction): void {
    this.sendError(req, res, err, 503);
  }
}

export default new APIUtils();
