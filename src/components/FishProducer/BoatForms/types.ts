interface Boat {
  id: string;
  name: string;
  registrationNumber: string;
  captainName: string;
  capacity: number;
  boxSize: "20kg" | "40kg";
  status: "active" | "maintenance" | "retired";
  photo: string;
  lastMaintenanceDate: string;
  currentUtilization?: number;
  totalBoxesUsed?: number;
}
interface EditBoatFormProps {
  boat: Boat;
  onClose: () => void;
}
