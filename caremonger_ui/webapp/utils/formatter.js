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
		getNav : function(orderStatus)
		{
			var value= "";
			
			if(orderStatus == "In Process")
			{
				value = "Navigation"
				
			}
			
			
		},
		
		getOrderStatus: function(orderStatus)
		{
			var value;
			if(orderStatus==="Not Assigned")
			{
				value="Error";
			}
			else if(orderStatus==="In Process")
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
				
		},
		getDate : function(date)
		{
			console.log(date);
			return new Date(date).toDateString();

		}
	}
};