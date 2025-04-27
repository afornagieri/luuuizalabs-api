const jwt = require('jsonwebtoken');
const { generateToken } = require('../../src/utils/jwt.js');

jest.mock('jsonwebtoken');

describe('generateToken', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'topsecret';
  });

  it('calls jwt.sign with correct payload, secret, and options', () => {
    jwt.sign.mockReturnValue('signed.token');
    const data = 'user123';

    const token = generateToken(data);

    expect(jwt.sign).toHaveBeenCalledWith(
      { data },
      'topsecret',
      { expiresIn: '1h' }
    );
    expect(token).toBe('signed.token');
  });
});
