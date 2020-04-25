utils = {
	Formatter: {
		getCriticality: function(state) {
			if(state=="Low")
			{
				var status="Success";
			}
			if(state=="Medium")
			{
				var status="Warning";
			}
			if(state=="High")
			{
				var status="Error";
			}
			return status;

		},

		getOrderStatus: function(orderStatus)
		{
			var value;
		
			if (orderStatus==="In Process")
			{
				value="Warning";
			}
			else if (orderStatus==="Completed")
			{
				value="Success";
			}
			else if (orderStatus==="Closed")
			{
				value="Error";
			}
			else if (orderStatus==="False")
			{
				value="Error";
			}
			return value;
				
		}
	}
};