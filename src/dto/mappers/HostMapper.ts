import { PaginatedResponse } from "../../services/interface/Iadmin";
import { 
  HostResponseDto, 
  HostListResponseDto 
} from "../admin/HostDto";

interface Host {
  id: string;
  name: string;
  listingCount: number;
  isRestricted: boolean;
}

export class HostMapper {
  static toHostResponseDto(host: Host): HostResponseDto {
    return {
      id: host.id,
      name: host.name,
      listingCount: host.listingCount,
      isRestricted: host.isRestricted
    };
  }

  static toHostResponseDtoArray(hosts: Host[]): HostResponseDto[] {
    return hosts.map(host => this.toHostResponseDto(host));
  }

  static toHostListResponseDto(paginatedHosts: PaginatedResponse<Host>): HostListResponseDto {
    return {
      data: this.toHostResponseDtoArray(paginatedHosts.data),
      total: paginatedHosts.total,
      currentPage: paginatedHosts.currentPage,
      totalPages: paginatedHosts.totalPages
    };
  }
}
