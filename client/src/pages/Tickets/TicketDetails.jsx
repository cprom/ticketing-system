import { useParams } from "react-router";
import useFetch from "../../hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";

const TicketDetails = () => {

       const getTickets = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const response = await fetch(`http://localhost:3000/api/tickets/${id}`);
        return await response.json();
    }

    const { id } = useParams();
    console.log(id)

    const { data, error, isPending } = useQuery({
        queryKey: ['tickets'],
        queryFn: getTickets
    });

    if(error){
        console.log(`Fetching Error: ${error}`);
    }

  return (
    <div style={{textAlign: 'center'}}>
        {isPending ? <Spin size="large" /> : <div>{JSON.stringify(data)}</div> }
    </div>
  )
}

export default TicketDetails
