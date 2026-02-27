type ApiResponse =
	| {
			success: true;
			data?: any;
	  }
	| {
			success: false;
			error: {
				message: string;
				stack?: string;
			};
	  };
export default ApiResponse;
