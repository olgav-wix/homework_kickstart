import axios from 'axios';

// FIXME: Replace with real experiment name!
const experimentName = 'specs.kickstart.Ovirchen';

describe('Greeter endpoint', () => {
  beforeEach(() => {
    petri.reset();
  });

  it('should return "Hello, world!" when experiment is not set up', async () => {
    const url = app.getUrl('/greeting');
    const response = await axios.get(url);

    expect(response.data).toEqual({ message: 'Hello, world!' });
  });

  it('should return "Hello, world!" when experiment returns false', async () => {
    petri.onConductExperiment((experiment: string) => {
      if (experiment === experimentName) {
        return 'false';
      }
      throw new Error(`Invalid experiment: ${experiment}`);
    });
    const url = app.getUrl('/greeting');
    const response = await axios.get(url);

    expect(response.data).toEqual({ message: 'Hello, world!' });
  });

  it('should return "Hey, you!" when experiment returns true', async () => {
    petri.onConductExperiment((experiment: string) => {
      if (experiment === experimentName) {
        return 'true';
      }
      throw new Error(`Invalid experiment: ${experiment}`);
    });
    const url = app.getUrl('/greeting');
    const response = await axios.get(url);

    expect(response.data).toEqual({ message: 'Hey, you!' });
  });
});
