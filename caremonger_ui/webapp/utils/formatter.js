utils = {
	Formatter: {
		getStatus: function(odate) {
			console.log(odate);
			if(odate===0)
			{
				var status="Request Pending";
			}
			else if(odate===1)
			{
				var status="Leave Approved";	
			}
			else
			{
				var status="Leave Rejected";		
			}
			return status;

		},
		getState: function(state)
		{
			var value;
			if(state===0)
			{
				value="Warning";
			}
			else if(state===1)
			{
				value="Success";
			}
			else
			{
				value="Error";
			}
			return value;
		},
		getOrderStatus: function(orderStatus)
		{
			var value;
			if(orderStatus==="To be delivered")
			{
				value="Warning";
			}
			else if(orderStatus==="Delivered")
			{
				value="Success";
			}
			else
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