export function createClient() {
  return {
    auth: {
      async getUser() {
        return { data: { user: null }, error: null };
      },
    },
    from(_table: string) {
      return {
        async insert(_data: Record<string, unknown>) {
          return { data: null, error: null };
        },
        async select() {
          return { data: [], error: null };
        },
      };
    },
  };
}
