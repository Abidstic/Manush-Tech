import { useState } from "react";
import Card from "../components/Card";
import Sidebar from "../components/Sidebar";
import Table from "../components/table/Table";
import user from "../constant/user.json";
import { numberOfMeal } from "../utils/helper";
import { COLUMNS, SIDEBAR_ITEMS } from "../constant";

const Dashboard = () => {
  const [data, setData] = useState(user);

  const handleDelete = (id) => {
    const newData = data.filter((item) => id !== item.id);
    setData(newData);
  };

  return (
    <div className="flex">
      <Sidebar menuItems={SIDEBAR_ITEMS} />
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold my-4 text-center text-gray-700">
          Meal Management
        </h1>
        <div className="flex flex-wrap justify-between  gap-10 items-center px-8 py-5">
          <Table
            columns={COLUMNS}
            data={data}
            className="w-full"
            onDelete={handleDelete}
          />
          <div className="flex w-full h-full gap-4">
            <Card
              title="Lunch"
              content={numberOfMeal(data, "lunch")}
              className="w-1/2 md:w-1/2 p-2"
            />

            <Card
              title="Snack"
              content={numberOfMeal(data, "snack")}
              className="w-full md:w-1/2 p-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
