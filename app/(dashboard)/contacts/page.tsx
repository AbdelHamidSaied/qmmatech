import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactsTable } from "./contacts-table";

const ContactsPage = () => {
  return (
    <Tabs
      className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24"
      defaultValue="contacts"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
        <TabsTrigger value="hasWhatsApp">Has WhatsApp</TabsTrigger>
        <TabsTrigger value="blockedCampaigns">Blocked Campaigns</TabsTrigger>
        <TabsTrigger value="blockedFromBot">Blocked From Bot</TabsTrigger>
        <TabsTrigger value="blockedFromCC">Blocked From CC</TabsTrigger>
      </TabsList>
      <TabsContent value="contacts">
        <ContactsTable />
      </TabsContent>
      <TabsContent value="hasWhatsApp">
        <ContactsTable filterKey="hasWhatsApp" />
      </TabsContent>
      <TabsContent value="blockedCampaigns">
        <ContactsTable filterKey="blockedCampaigns" />
      </TabsContent>
      <TabsContent value="blockedFromBot">
        <ContactsTable filterKey="blockedFromBot" />
      </TabsContent>
      <TabsContent value="blockedFromCC">
        <ContactsTable filterKey="blockedFromCC" />
      </TabsContent>
    </Tabs>
  );
};

export default ContactsPage;
