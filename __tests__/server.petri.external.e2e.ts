import axios from 'axios';

// FIXME: Replace with real experiment name!
const experimentName = 'specs.kickstart.OvirchenTest';

describe('Endpoint that calls an external API', () => {
  beforeAll(() => {
    httpTestkit.getApp().get('/users/1', (req, res) => {
      res.json({ user: 'First user' });
    });
    httpTestkit.getApp().get('/users/2', (req, res) => {
      res.json({ user: 'Second user' });
    });
  });

  beforeEach(() => {
    petri.reset();
  });

  it('should return "First user" when experiment is not set up', async () => {
    const url = app.getUrl('/user');
    const response = await axios.get(url);

    expect(response.data).toEqual({ user: 'First user' });
  });

  it('should return "First user" when experiment returns false', async () => {
    petri.onConductExperiment((experiment: string) => {
      if (experiment === experimentName) {
        return 'false';
      }
      throw new Error(`Invalid experiment: ${experiment}`);
    });
    const url = app.getUrl('/user');
    const response = await axios.get(url);

    expect(response.data).toEqual({ user: 'First user' });
  });

  it('should return "Second user" when experiment returns true', async () => {
    petri.onConductExperiment((experiment: string) => {
      if (experiment === experimentName) {
        return 'true';
      }
      throw new Error(`Invalid experiment: ${experiment}`);
    });
    const url = app.getUrl('/user');
    const response = await axios.get(url);

    expect(response.data).toEqual({ user: 'Second user' });
  });
});
