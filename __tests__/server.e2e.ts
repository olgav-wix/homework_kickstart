import axios from 'axios';
import request from 'supertest';
import nock from 'nock';
import { KEY, BASE_PATH } from '../src/config';
import { cache } from '../src/server';

describe('When rendering', () => {
  it('should display a title', async () => {
    const url = app.getUrl('/');
    const response = await axios.get(url);

    expect(response.data).toContain('Wix Full Stack Project Boilerplate');
  });
});
