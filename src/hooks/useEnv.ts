interface EnvironmentVariables {
  alchemyKey: string;
}

function useEnv(): EnvironmentVariables {
  const env = (import.meta as ImportMeta).env;

  return {
    alchemyKey: env.VITE_ALCHEMY_KEY || '',
  };
}

export default useEnv;
