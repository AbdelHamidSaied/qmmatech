import { Contact, columns } from "./columns";
import { DataTable } from "./dataTable";
import { slug } from "cuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactForm } from "@/components/create-contact";

async function getData(): Promise<Contact[]> {
  // Fetch data from your API here.
  return [
    {
      id: slug(),
      phone: "01118000368",
      firstName: "AbdelHamid",
      lastName: "Saied",
      email: "midois2004@gmail.com",
    },
    // ...
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="ContactList" >
        <TabsList>
          <TabsTrigger value="ContactList">Contact List</TabsTrigger>
          <TabsTrigger value="CreateContact">Create Contact</TabsTrigger>
        </TabsList>
        <TabsContent value="ContactList">
          <DataTable columns={columns} data={data} />
        </TabsContent>
        <TabsContent value="CreateContact">
          <ContactForm/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
